import { Button, useToast } from "nexi-agent";

// wrap your app once: <ToastProvider><App /></ToastProvider>
export default function ToastExample() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <Button size="sm" onClick={() => toast({ title: "Run finished", description: "3 suppliers emailed.", tone: "success" })}>
        Success
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({
            title: "Export failed",
            description: "The POS API timed out.",
            tone: "error",
            action: { label: "Retry", onClick: () => console.log("retry") },
          })
        }
      >
        Error with action
      </Button>
      <Button size="sm" onClick={() => toast({ title: "Copied to clipboard", duration: 1500 })}>
        Short
      </Button>
    </div>
  );
}
