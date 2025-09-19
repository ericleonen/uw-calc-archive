import SelectInput from "@/components/SelectInput";
import TextInput from "@/components/TextInput";
import { requireUser } from "@/server/guards";
import { CLASSES } from "../search/constants";
import { createClient } from "@/utils/supabase/server";
import { updateProfile } from "@/actions/profile";
import SubmitButton from "@/components/SubmitButton";
import Divider from "@/components/Divider";
import { deleteAccount, signout } from "@/actions/auth";

export default async function ProfilePage() {
    const user = await requireUser();

    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, class")
        .eq("id", user.id)
        .single()

    return (
        <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90">
            <h2 className="text-xl font-bold text-gray-600/90">My Profile</h2>
            <Divider text="update profile" className="mt-4 mb-2" />
            <p className="text-sm font-medium text-center text-gray-400/90">Change information about yourself. Changing class will change the default class filter.</p>
            <form
                action={updateProfile}
                className="w-full mt-3"
            >
                <div className="w-full mb-6 space-y-2">
                    <TextInput
                        for_="name"
                        placeholder="Your name here"
                        initialValue={profile?.name}
                    />
                    <TextInput
                        for_="email"
                        disabled
                        initialValue={user.email}
                    />
                    <SelectInput
                        label="class"
                        placeholder="Select your class"
                        options={CLASSES}
                        initialValue={profile?.class}
                    />
                </div>
                <SubmitButton label="Save" />
            </form>
            <Divider text="signout" className="mt-6 mb-2"/>
            <p className="text-sm font-medium text-center text-gray-400/90">Hitting the button below will not delete your account, but while you're are signed out, you can't see which questions you marked as completed.</p>
            <form
                action={signout}
                className="w-full mt-3"
            >
                <SubmitButton label="Sign out" theme="secondary" />
            </form>
            <Divider text="delete account" className="mt-6 mb-2"/>
            <p className="text-sm font-medium text-center text-gray-400/90">Hitting the button below will forever lose the questions you marked as completed. You cannot un-delete your account.</p>
            <form
                action={deleteAccount}
                className="w-full mt-3"
            >
                <SubmitButton label="Delete account" theme="danger" />
            </form>
        </div>
    );
}