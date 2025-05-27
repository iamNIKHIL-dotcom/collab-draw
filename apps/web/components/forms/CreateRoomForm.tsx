"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { getVerifiedToken } from "@/lib/cookie";
import { useToast } from "@repo/ui/hooks/use-toast";
import { AxiosError } from "axios";

export function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getVerifiedToken();
      const response = await axios.post(
        `${BACKEND_URL}/rooms/create-room`,
        { name: roomName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Success",
        description: "Room created successfully!",
      });
      router.push(`/canvas/${encodeURIComponent(response.data.roomId)}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to create room",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full px-4"
>
  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
    <Label htmlFor="roomName" className="block whitespace-nowrap">
      Room Name
    </Label>
    <Input
      id="roomName"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      required
      placeholder="Create your room"
      className="text-white w-full sm:w-64"
    />
  </div>
  <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
    Create Room
  </Button>
</form>

  );
}
