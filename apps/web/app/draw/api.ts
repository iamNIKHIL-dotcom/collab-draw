import { BACKEND_URL } from "@/config";
import { getVerifiedToken } from "@/lib/cookie";
import axios from "axios";
import { useToast,toast } from "@repo/ui/hooks/use-toast";
import { AxiosError } from "axios";

export async function getExistingShapes(slug: string) {
  try {
    const token = await getVerifiedToken();
    const res = await axios.get(`${BACKEND_URL}/chat/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = res.data.chats || [];
    return messages.map((message: any) => {
      try {
        return JSON.parse(message?.message);
      } catch (e) {
        console.error("Error parsing message:", e);
        return null;
      }
    }).filter(Boolean); // Filter out any null values from failed parsing
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to fetch shapes",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    return [];
  }
}
