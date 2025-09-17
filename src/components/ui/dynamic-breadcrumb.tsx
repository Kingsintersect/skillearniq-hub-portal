"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Slash, Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbItemType {
    href: string;
    label: string;
    dropdown?: { label: string; href: string }[];
}

interface DynamicBreadcrumbProps {
    homeLabel?: string;
    capitalizeLabels?: boolean;
    maxItems?: number;
    dropdownMappings?: Record<string, { label: string; items: { label: string; href: string }[] }>;
}

export function DynamicBreadcrumb({
    homeLabel = "Home",
    capitalizeLabels = true,
    maxItems = 4,
    dropdownMappings = {},
}: DynamicBreadcrumbProps) {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);

    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/").filter((segment) => segment !== "");

            const crumbs: BreadcrumbItemType[] = [];

            crumbs.push({
                href: "/",
                label: homeLabel,
            });

            let currentPath = "";
            segments.forEach((segment) => {
                currentPath += `/${segment}`;
                let label = segment.replace(/-/g, " ");
                if (capitalizeLabels) {
                    label = label
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");
                }

                const hasDropdown = dropdownMappings[segment] !== undefined;

                crumbs.push({
                    href: currentPath,
                    label: label,
                    dropdown: hasDropdown ? dropdownMappings[segment].items : undefined,
                });
            });

            let newBreadcrumbs: BreadcrumbItemType[] = [];

            if (crumbs.length > maxItems && maxItems > 2) {
                const startItems = Math.ceil(maxItems / 2);
                const endItems = Math.floor(maxItems / 2);
                newBreadcrumbs = [
                    ...crumbs.slice(0, startItems),
                    { href: "", label: "..." },
                    ...crumbs.slice(crumbs.length - endItems),
                ];
            } else {
                newBreadcrumbs = crumbs;
            }

            // ✅ Only update if breadcrumbs actually changed
            const isEqual =
                JSON.stringify(newBreadcrumbs) === JSON.stringify(breadcrumbs);
            if (!isEqual) {
                setBreadcrumbs(newBreadcrumbs);
            }
        }
    }, [pathname, homeLabel, capitalizeLabels, maxItems, dropdownMappings, breadcrumbs]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                        {index > 0 && (
                            <BreadcrumbSeparator>
                                <Slash size={16} />
                            </BreadcrumbSeparator>
                        )}
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : crumb.dropdown ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1 text-blue-600 hover:underline">
                                        {crumb.label}
                                        <ChevronDown size={14} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {crumb.dropdown.map((item, idx) => (
                                            <DropdownMenuItem key={idx} asChild>
                                                <Link href={item.href}>{item.label}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : crumb.href === "" ? (
                                <span className="text-muted-foreground">{crumb.label}</span>
                            ) : (
                                <BreadcrumbLink href={crumb.href}>
                                    {index === 0 ? (
                                        <span className="flex items-center gap-1">
                                            <Home size={16} />
                                            <span className="sr-only md:not-sr-only">
                                                {crumb.label}
                                            </span>
                                        </span>
                                    ) : (
                                        crumb.label
                                    )}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
