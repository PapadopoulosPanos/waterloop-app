"use client";

import React, { startTransition, useActionState, useState } from "react";
import { Button } from "./ui/button";
import { Bot, Loader, Loader2, X } from "lucide-react";
import { Input } from "./ui/input";
import { type AiState, processAiMessage } from "@/app/actions";
import { Textarea } from "./ui/textarea";

function Message({ message }: { message: AiState }) {
  if (message.role === "function") return null;

  const response = message.content ?? null;

  if (message.role === "user") {
    return (
      <div className="flex flex-col">
        <small className="text-sm text-muted-foreground ml-2">You</small>
        <div className="px-3 py-4 rounded-lg bg-blue-500">{response}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <small className="text-sm text-muted-foreground ml-2">Assistant</small>
      <div
        className="px-3 py-4 rounded-lg bg-gray-800"
        dangerouslySetInnerHTML={{ __html: response }}
      />
    </div>
  );
}

function Chatbot() {
  const initialState: AiState[] = [{ role: "", content: "" }];
  const [open, setOpen] = useState<boolean>(false);
  const [stateProcessMessage, formActionProcessMessage, isPending] =
    useActionState(processAiMessage, initialState);

  const clearChat = () => {
    const formData = new FormData();
    formData.append("clear", "true");
    startTransition(() => formActionProcessMessage(formData));
  };

  return (
    <div className="fixed md:bottom-4 md:right-4 z-50 right-0 bottom-0">
      {open ? (
        <div className="w-screen h-screen md:w-[420px] md:h-[750px] shadow-lg rounded-lg flex flex-col bg-black border-gray-900 border">
          <div className="flex justify-between items-center p-4 border-b text-white bg-black rounded-t-lg">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              size="icon"
              className="rounded-full border-0"
            >
              <X />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {stateProcessMessage.length > 0 &&
              stateProcessMessage
                .slice(1, stateProcessMessage.length)
                .map((message, index) => (
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Message key={`${index}_${message}`} message={message} />
                  </div>
                ))}
          </div>
          <div className="p-4 border-t">
            <form
              action={formActionProcessMessage}
              className="flex flex-col space-y-2"
            >
              <Textarea
                disabled={isPending}
                className="w-full p-2 border rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ask AI assistant"
                rows={2}
                name="message"
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Ask"}
              </Button>
              <Button
                onClick={clearChat}
                type="button"
                disabled={isPending}
                variant="outline"
              >
                Clear History
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="icon"
          className="h-16 w-16 bg-black flex justify-center items-center rounded-full"
        >
          <Bot className="!size-8" />
        </Button>
      )}
    </div>
  );
}

export default Chatbot;
