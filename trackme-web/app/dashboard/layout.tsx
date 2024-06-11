export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex flex-col  justify-start items-center">
      {children}
    </div>
  );
}
