import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../server/utils/connectMongo";
import { User } from "../../../server/models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectMongo();
    if (req.method === "GET") {
        try {
         const users = await User.find();  
         users
         ? res.status(200).send(users)
         : res.status(201).json([]);
         
        } catch (error: any) {
          if (error.path === "_id") {
             res.status(404).send("The user with the given ID was not found");
              return;
           }
           console.error(error)
           res.status(500).json({ error: "Internal server error." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}