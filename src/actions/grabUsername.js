'use server';
import { authOptions } from "@/lib/auth";
import { page } from "@/models/page";
import { getServerSession } from "next-auth";
import { cyrillicToLatin } from "@/app/api/vcard/route";
import mongoose from "mongoose";

function containsCyrillic(text) {
    return /[\u0400-\u04FF]/.test(text);
}

export default async function grabUsername(formData) {
    let username = formData.get('username');

    if (containsCyrillic(username)) {
        username = cyrillicToLatin(username);
    }

    mongoose.connect(process.env.MONGO_URI);

    const existingPageDoc = await page.findOne({uri:username});
    if (existingPageDoc) {
        return false;
    } else {
        const session = await getServerSession(authOptions);
        const newPage = await page.create({
            uri:username, 
            owner:session?.user?.email,
        });
        return {
            success: true,
            uri: newPage.uri,
            owner: newPage.owner
        };
    }
}