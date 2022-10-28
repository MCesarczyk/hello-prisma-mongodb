import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IUser {
  name: string;
  email: string;
};

interface IUserWithDetails extends IUser {
  posts: {
    create: {
      title: string;
      body: string;
      slug: string;
    },
  },
};

const fetchAllUsers = async () => {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
};

const createUser = async (user: IUserWithDetails) => {
  await prisma.$connect();

  await prisma.user.create({ data: user });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  console.dir(allUsers, { depth: null });
};

const updatePost = async (newSlug: string, newComments: string[]) => {
  await prisma.post.update({
    where: {
      slug: newSlug,
    },
    data: {
      comments: {
        createMany: {
          data: newComments.map(newComment => ({ comment: newComment })),
        },
      },
    },
  })
  const posts = await prisma.post.findMany({
    include: {
      comments: true,
    },
  });

  console.dir(posts, { depth: Infinity });
};

async function main() {
  await prisma.$connect();

  // fetchAllUsers();

  // createUser({
  //   name: 'Rich',
  //   email: 'hello@prisma.com',
  //   posts: {
  //     create: {
  //       title: 'My first post',
  //       body: 'Lots of really interesting stuff',
  //       slug: 'my-first-post',
  //     },
  //   },
  // });

  updatePost('my-first-post', ['Great post!', "Can't wait to read more!"]);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
