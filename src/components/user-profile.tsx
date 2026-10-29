"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserInfo, editUserInfo } from "@/services/user";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/utils/cloudinaryService";
import Image, { StaticImageData } from "next/image";
import { ProfileIcon } from "@/assets";


interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}


const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, setUpdate }) => {
  const [username, setUsername] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | StaticImageData>(ProfileIcon);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUserProfile = async () => {
        try {
          const userProfile = await getUserInfo();
          setUsername(userProfile.name);
          if (userProfile.avatar){
            setPhotoUrl(userProfile.avatar);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [isOpen]);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);
    setPhotoUrl(imageUrl || "");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await editUserInfo({
        name: username,
        photo: typeof photoUrl === "string" ? photoUrl : "",
      });
      setUpdate((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error saving user profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>Edite suas informações e salve.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              {photoUrl && <Image src={photoUrl} width={90} height={90} alt="Profile Picture" onClick={handleFileInput} className="rounded-full mx-auto border-2 border-primary cursor-pointer hover:opacity-60" />}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
            <Label>Nome</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </>
        )}
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;