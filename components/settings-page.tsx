"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/contexts/UserContext"
import { API_BASE_URL } from "@/lib/config"
import axios from "axios"

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 text-gray-600 dark:text-gray-400"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function SettingsPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [whatsappState, setWhatsappState] = useState<string>("unknown")
  const { toast } = useToast()
  const { user } = useUser()

  // Initialize connection status and phone number from user data
  useEffect(() => {
    if (user) {
      // Only set these values if they're not already set correctly
      if (phoneNumber !== user.phone_number && user.phone_number) {
        setPhoneNumber(user.phone_number)
      }
    }
  }, [user])

  // Fetch WhatsApp state
  useEffect(() => {
    let isMounted = true;
    const fetchWhatsAppState = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`${API_BASE_URL}/get-state?user_id=${user.id}`)
          if (response.ok && isMounted) {
            const data = await response.json()
            // Check both status and notification_active flag
            if (data.status === "success") {
              if (data.notification_active) {
                setWhatsappState("connected")
                setIsConnected(true)
              } else {
                setWhatsappState("disconnected")
                setIsConnected(false)
              }
              // Update phone number if available
              if (data.phone_number && phoneNumber !== data.phone_number) {
                setPhoneNumber(data.phone_number)
              }
            } else {
              setWhatsappState("disconnected")
              setIsConnected(false)
            }
          }
        } catch (error) {
          console.error("Failed to fetch WhatsApp state:", error)
          if (isMounted) {
            // Don't update state on error if we're already connected
            if (!isConnected) {
              setWhatsappState("error")
            }
          }
        }
      }
    }

    fetchWhatsAppState()
    const interval = setInterval(fetchWhatsAppState, 30000)
    
    return () => {
      isMounted = false;
      clearInterval(interval)
    }
  }, [user?.id, phoneNumber])

  const handleConnect = async () => {
    if (!isConnected) {
      console.log('Attempting to connect with phone number:', phoneNumber)
      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(phoneNumber)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number with country code (e.g. +1234567890)",
          variant: "destructive"
        })
        return
      }

      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "Please log in to enable WhatsApp notifications",
          variant: "destructive"
        })
        return
      }

      setIsLoading(true)
      try {
        console.log('Making API call to connect endpoint')
        const response = await fetch(`${API_BASE_URL}/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            phone_number: phoneNumber,
            user_id: user.id
          })
        })

        console.log('API Response:', response)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          throw new Error(errorData.detail || 'Failed to connect WhatsApp')
        }

        const data = await response.json()
        console.log('Success response:', data)

        setIsConnected(true)
        setWhatsappState("connected")
        toast({
          title: "WhatsApp Connected",
          description: "You will now receive meeting analysis notifications via WhatsApp",
          variant: "default"
        })
      } catch (error) {
        console.error('Connection error:', error)
        toast({
          title: "Connection Failed",
          description: "Failed to connect WhatsApp. Please try again.",
          variant: "destructive"
        })
        setIsConnected(false)
        setWhatsappState("disconnected")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Handle disconnect
      setIsLoading(true)
      try {
        console.log('Making API call to disconnect endpoint')
        const response = await fetch(`${API_BASE_URL}/disconnect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            user_id: user?.id
          })
        })

        console.log('Disconnect API Response:', response)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Disconnect error response:', errorData)
          throw new Error(errorData.detail || 'Failed to disconnect WhatsApp')
        }

        setIsConnected(false)
        setWhatsappState("disconnected")
        setPhoneNumber("")
        toast({
          title: "WhatsApp Disconnected",
          description: "You will no longer receive WhatsApp notifications",
          variant: "default"
        })
      } catch (error) {
        console.error('Disconnection error:', error)
        toast({
          title: "Disconnection Failed",
          description: "Failed to disconnect WhatsApp. Please try again.",
          variant: "destructive"
        })
        // Keep the connected state on disconnect failure
        setIsConnected(true)
        setWhatsappState("connected")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your WhatsApp notification settings
        </p>
      </div>

      {/* WhatsApp Notifications */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">WhatsApp Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#25D366] dark:bg-[#25D366] rounded-lg flex items-center justify-center">
                <WhatsAppIcon />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">WhatsApp</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive meeting summaries and notifications via WhatsApp
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: <span className={`font-medium ${isConnected ? "text-green-600" : "text-yellow-600"}`}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </p>
              </div>
            </div>
            <Button 
              variant={isConnected ? "destructive" : "outline"} 
              size="sm"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isConnected ? "Disconnecting..." : "Connecting..."}
                </span>
              ) : isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          {!isConnected && (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter your phone number with country code
                  </p>
                </div>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                WhatsApp notifications are enabled for: {phoneNumber}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
