"use client"

import { redirect } from "next/navigation";
import { api } from "~/trpc/react";

function getUserInfo() {
    const data = window.localStorage.getItem("user");

    if (!data) {
        redirect('/login');
    }

    const userInfo = JSON.parse(data) as { username: string, password: string };

    if (!userInfo?.username || !userInfo?.password) {
        redirect('/login');
    }

    return userInfo;
}

export default function Main() {
    const { username, password } = getUserInfo();

    const userDataQuery = api.user.getUserdata.useQuery({ username, password });

    if (userDataQuery.error) {
        redirect('/login');
    }

    return (
        <div className="h-screen w-full flex-1 flex-col flex items-center justify-center bg-slate-950">

        </div>
    )


}
