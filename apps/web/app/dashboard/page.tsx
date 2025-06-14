"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/card";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { getVerifiedToken } from "@/lib/cookie";
import { CreateRoomForm } from "@/components/forms/CreateRoomForm";
import { useToast } from "@repo/ui/hooks/use-toast";
import { AxiosError } from "axios";
import { Input } from "@repo/ui/components/input";

type Room = {
  id: number;
  slug: string;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [joinSlug, setJoinSlug] = useState("");

  const { toast } = useToast();

  const handleJoinRoom = async () => {
    if (!joinSlug.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await getVerifiedToken();
      const response = await axios.post(
        `${BACKEND_URL}/rooms/join`,
        {
          slug: joinSlug,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const roomId = response.data.roomId;

      router.push(`/canvas/${roomId}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to join room",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const token = await getVerifiedToken();
        console.log(token);

        const response = await axios.get(`${BACKEND_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data.rooms);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast({
            title: "Error",
            description: err.response?.data?.message || "Failed to fetch rooms",
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
    fetchRooms();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Your Drawing Rooms
          </h1>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:items-end">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <Input
                placeholder="Enter room name"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                className="text-white w-full sm:w-64"
              />
              <Button onClick={handleJoinRoom} className="w-full sm:w-auto">
                Join Room
              </Button>
            </div>

            {/* Create Room Form will now match input/button size and layout */}
            <div className="w-full sm:w-auto flex-1">
              <CreateRoomForm />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-card-foreground">
                    {room.slug}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push(`/canvas/${room.id}`)}
                  >
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            ))}

            {!loading && rooms.length === 0 && (
              <Card className="col-span-full bg-muted/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-card-foreground">
                    No Rooms Yet
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Create your first drawing room to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CreateRoomForm />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
