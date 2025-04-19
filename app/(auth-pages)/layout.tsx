export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center">
      <div className="max-w-7xl h-full flex flex-col gap-12 items-start">
        {children}
      </div>
    </div>
  );
}

