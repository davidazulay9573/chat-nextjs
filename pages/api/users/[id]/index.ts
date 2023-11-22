import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../server/models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
         const { id } = req.query;
         let user       
         if(!user) user = await User.findById(id)
         !user 
         ? res.status(404).send({error: "The user with the given ID was not found"})
         : res.status(200).json(user);
           res.send(id)
        } catch (error: any) {
          if (error.path === "_id") {
             res.status(404).send({error: "The user with the given ID was not found"});
              return;
           }
           console.error(error)
           res.status(500).json({ error: "Internal server error." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}