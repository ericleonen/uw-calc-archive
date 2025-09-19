import SelectInput from "@/components/SelectInput";
import TextInput from "@/components/TextInput";
import { requireUser } from "@/server/guards";
import { CLASSES } from "../search/constants";
import { createClient } from "@/utils/supabase/server";
import { updateProfile } from "@/actions/profile";
import SubmitButton from "./components/SubmitButton";

export default async function ProfilePage() {
    const user = await requireUser();

    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, class")
        .eq("id", user.id)
        .single()

    return (
        <form
            action={updateProfile}
            className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90"
        >
            <h2 className="text-lg font-semibold text-gray-700/90">Profile</h2>
            <div className="w-full space-y-2">
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
    );
}