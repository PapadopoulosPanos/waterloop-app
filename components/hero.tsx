import AppLogo from "@/app/WaterLoop-Logo-removebg.png";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex gap-8 justify-center items-center">
        <Image src={AppLogo} height={250} alt="logo" />
      </div>
      <h1 className="sr-only">Water-loop System! Every Drop Matters!</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center flex flex-col gap-4">
        {/* <span className="font-semibold">Waterloop</span> */}
        <span>Every Drop Matters!</span>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}

