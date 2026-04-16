import prisma from "../../../utils/prisma.js";

const createPost = async (data: any, staff: any) => {
    const postData: any = {
        title: data.title,
        content: data.content,
        tags: data.tags,
        category: data.category,
        author: {
            connect: { id: staff.id }
        }
    };

    if (staff.businessBranchId) {
        postData.businessBranch = {
            connect: { id: staff.businessBranchId }
        };
    }

    return await prisma.portalPost.create({
        data: postData,
        include: {
            author: true,
            businessBranch: true,
        },
    });
};

const getAllPosts = async (filters: any) => {
    const { sortBy } = filters;
    const where: any = {};

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "Newest") orderBy = { createdAt: "desc" };
    if (sortBy === "Top") orderBy = { likes: "desc" };
    // Simplified relevance/replies for now

    const result = await prisma.portalPost.findMany({
        where,
        orderBy,
        include: {
            author: true,
        },
    });

    return result;
};

const getMyPosts = async (staffId: string) => {
    return await prisma.portalPost.findMany({
        where: { authorId: staffId },
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
        },
    });
};

const likePost = async (postId: string, staffId: string, like: boolean) => {
    const post = await prisma.portalPost.findUnique({
        where: { id: postId },
    });

    if (!post) throw new Error("Post not found");

    let likedBy = post.likedBy || [];
    if (like) {
        if (!likedBy.includes(staffId)) likedBy.push(staffId);
    } else {
        likedBy = likedBy.filter((id) => id !== staffId);
    }

    return await prisma.portalPost.update({
        where: { id: postId },
        data: {
            likedBy,
            likes: likedBy.length,
        },
    });
};

const deletePost = async (postId: string) => {
    return await prisma.portalPost.delete({
        where: { id: postId },
    });
};

const getPopularTags = async () => {
    // This is a simplified implementation. In a real app, you might want more complex aggregation.
    const posts = await prisma.portalPost.findMany({
        select: { tags: true }
    });

    const tagCounts: { [key: string]: number } = {};
    posts.forEach(post => {
        post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
};

export const PortalService = {
    createPost,
    getAllPosts,
    getMyPosts,
    likePost,
    deletePost,
    getPopularTags,
};
