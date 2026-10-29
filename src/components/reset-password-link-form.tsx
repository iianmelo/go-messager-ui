"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export function ResetPasswordLinkForm() {

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Link enviado</CardTitle>
        <CardDescription>
          O e-mail pode levar alguns segundos para chegar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm">
          Já redefiniu a senha?{" "}
          <Link href="/signin" className="underline">
            Entrar
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Não recebeu o e-mail?{" "}
          <Link href="/forgot-password" className="underline">
            Tentar de novo
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
