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

export function Entries() {
    const { username, password } = getUserInfo();

    const userData = api.user.login({ username, password });

    if (!userData.success) {
        redirect('/login');
    }

    const userEntries = api.user.getUserdata({ username, password });

    return (
        <div>

        </div>
    )

}
