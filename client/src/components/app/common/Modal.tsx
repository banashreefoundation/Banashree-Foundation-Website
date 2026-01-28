import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";
import { useGenericFormContext } from "@/providers/FormProvider";
import React, { useEffect, useState } from "react";


type ShareModalType = {
  title: string;
  open?: boolean;
  cancel?: string;
  width?: string;
  height?: string;
  children: React.ReactNode;
  viewAction?: boolean;
  action?: string;
  overflow?: string;
  handleClose?: () => void;
  handleSubmit?: () => void;
  onSubmit?: (data: any) => void;
  formState?: any;
  setOpen?:any;
  isValid: boolean;
};




const ShareddModal = ({setOpen, title, open, handleClose, children, action, formState, onSubmit}: ShareModalType) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-screen-2xl w-full h-auto overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-xl" style={{fontFamily: "CiscoSans-Medium"}}>{title}</DialogTitle>
        </DialogHeader>
        <Separator />
        {children}
        <DialogFooter>
          <Button className="w-32 bg-[#fff] text-black" type="submit" onClick={handleClose}>Cancel</Button>
          {action === "Delete" && 
          <Button className="w-32 bg-[#480900]" type="submit" onClick={onSubmit}>{action}</Button>}
          {action !== "View" && action !== "Delete" &&<Button className="w-32 bg-[#480900]" type="submit" onClick={() => {
            formState.handleSubmit(onSubmit)();}} disabled={!formState.isValid}>{action}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareddModal