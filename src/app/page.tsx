import Link from "next/link";
import { redirect } from "next/navigation";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

function getUserInfo() {
    const data = localStorage.getItem("user");

    if (!data) {
        redirect('/login');
    }

    const userInfo = JSON.parse(data) as { username: string, password: string };

    if (!userInfo?.username || !userInfo?.password) {
        redirect('/login');
    }

    return userInfo;
}

export default async function Home() {
    const { username, password } = getUserInfo();

    const userData = await api.user.login({ username, password });

    if (!userData.success) {
        redirect('/login');
    }

    const userEntries = await api.user.getUserdata({ username, password });

    return (
        <div>
            <p>

            </p>
        </div>
    );
}
