import Image from "next/image";
import { LoginButton, LogoutButton } from "./api/auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "./user";

export default async function Home() {
    const session = await getServerSession(authOptions);
    return (
        <main className="flex flex-col gap-4">
            <div className="flex gap-4">
                <LoginButton />
                <LogoutButton />
            </div>
            <div>Server Side Call</div>
            <div>{JSON.stringify(session)}</div>
            <div>Client Side Call</div>
            <User />
        </main>
    );
}
