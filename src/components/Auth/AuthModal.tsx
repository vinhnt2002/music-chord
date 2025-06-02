import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModal";
import { Facebook } from "lucide-react";
import { useState } from "react";

const AuthModal = () => {
  const { isOpen, onOpen, onClose } = useModal();
  const [typeAuth, setTypeAuth] = useState<"signUp" | "signIn">("signUp");

  const toggleAuthType = () => {
    setTypeAuth((prev) => (prev === "signUp" ? "signIn" : "signUp"));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          return;
        }
        onOpen("authModal", { isOpen: open });
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold">
            {typeAuth === "signUp"
              ? "Sign up to Chordify"
              : "Log in to Chordify"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-6">
          {/* Facebook Login Button */}
          <Button
            variant="outline"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Continue with Facebook
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">OR</span>
            </div>
          </div>

          {/* Auth Form */}
          <form className="space-y-4">
            {typeAuth === "signUp" && (
              <div className="space-y-2">
                <Label htmlFor="firstName">First name (required)</Label>
                <Input id="firstName" placeholder="Billie" className="w-full" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address (required)</Label>
              <Input
                id="email"
                type="email"
                placeholder="billie.e@chordify.net"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (required)</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                className="w-full"
              />
            </div>

            <div className="pt-2">
              {typeAuth === "signUp" ? (
                <Button
                  variant="link"
                  className="text-sm text-teal-600 hover:text-teal-700 p-0"
                >
                  Terms and conditions apply
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="text-sm text-gray-700 hover:text-gray-900 p-0"
                >
                  Forgot password?
                </Button>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={toggleAuthType}
          >
            {typeAuth === "signUp" ? "Log in instead" : "Create account"}
          </Button>
          <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
            {typeAuth === "signUp" ? "Create account" : "Log in"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
