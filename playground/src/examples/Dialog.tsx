import { useState } from "react";
import { Button, Dialog } from "nexi-agent";

export default function DialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
        Retire flavor…
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Retire Bubblegum?"
        description="It will be removed from the menu and all scheduled churns. You can bring it back later."
        destructive
        labels={{ confirm: "Retire flavor" }}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 600)); // your API call
        }}
      />
    </>
  );
}
