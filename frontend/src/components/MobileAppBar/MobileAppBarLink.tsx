import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileAppBarLinkProps = {
    Icon: React.ForwardRefExoticComponent<any>,
    label: string,
    to: string
}

export default function MobileAppBarLink({ Icon, label, to }: MobileAppBarLinkProps) {
    const pathname = usePathname();
    const active = pathname.split("/").at(-1) === to;

    return (
        <Link
            href={`${to}`}
            className={
                "flex flex-col items-center justify-center h-full p-1 aspect-square rounded-full " +
                (active ? "text-uw/90" : "text-gray-400/90 hover:text-uw/90 hover:bg-purple-100/90")
            }
            title={label}
        >
            <Icon />
        </Link>
    )
}