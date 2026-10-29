"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import resetpassword from "@/services/resetpassword";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const startTime = Date.now();
    try {
      await resetpassword({ email });
    } catch (error) {
      console.error('Error sending password reset email:', error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, 2000 - elapsedTime); // Garante um tempo mínimo de 2 segundos
      setTimeout(() => {                            // Garante segurança para evitar que se saiba se o email está cadastrado na aplicação ou não
        setIsLoading(false);
        router.push("/reset-password-link");
      }, delay);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Esqueci a senha</CardTitle>
        <CardDescription>
          Informe o e-mail para receber o link de redefinição
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ana.bezerra@cin.ufpe.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Enviar link"
              )}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Lembrou a senha?{" "}
          <Link href="/signin" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}