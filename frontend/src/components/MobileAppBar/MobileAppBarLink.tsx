import Link from "next/link";
import { RefAttributes } from "react";

type MobileAppBarLinkProps = {
    Icon: React.ForwardRefExoticComponent<RefAttributes<SVGSVGElement>>,
    label: string,
    to: string,
    active: boolean
}

export default function MobileAppBarLink({ Icon, label, to, active }: MobileAppBarLinkProps) {
    return (
        <Link
            href={`${to}`}
            className={
                "flex flex-col items-center justify-center h-full p-1 aspect-square rounded-full " +
                (active ? "text-uw/90" : "text-gray-400/90 hover:text-uw/90 hover:bg-purple-100")
            }
            title={label}
        >
            <Icon />
        </Link>
    )
}