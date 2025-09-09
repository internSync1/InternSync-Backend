import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../common/middleware/async';
import Content from '../models/contentModel';

const HOUSE_RULES_SLUG = 'house-rules';

export const getHouseRules = asyncHandler(async (req: Request, res: Response) => {
    let doc = await Content.findOne({ slug: HOUSE_RULES_SLUG });
    if (!doc) {
        // Seed with an initial value if not present
        doc = await Content.create({
            slug: HOUSE_RULES_SLUG,
            title: 'House Rules',
            body: `Welcome to InternSync.\n\n1. Be respectful and professional.\n2. Apply only to roles you genuinely intend to pursue.\n3. Keep your profile accurate and up to date.\n4. Do not spam employers or other users.\n5. Report suspicious listings to the team.`,
            published: true,
        });
    }
    return res.status(200).json({ success: true, data: doc });
});

export const updateHouseRules = asyncHandler(async (req: Request, res: Response) => {
    const { title, body, published } = req.body as { title?: string; body?: string; published?: boolean };

    const update: any = {};
    if (typeof title === 'string') update.title = title;
    if (typeof body === 'string') update.body = body;
    if (typeof published === 'boolean') update.published = published;

    const doc = await Content.findOneAndUpdate(
        { slug: HOUSE_RULES_SLUG },
        { $set: update },
        { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: doc });
});
