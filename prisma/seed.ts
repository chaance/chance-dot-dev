import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
	slugify,
	isValidEmail,
	validatePassword,
	getRequiredServerEnvVar,
} from "../app/lib/utils";

const prisma = new PrismaClient();

const AUTHENTICATED_EMAIL = getRequiredServerEnvVar("AUTHENTICATED_EMAIL");
const AUTHENTICATED_EMAIL_PASSWORD = getRequiredServerEnvVar(
	"AUTHENTICATED_EMAIL_PASSWORD",
);

async function seed() {
	// check if database is already seeded
	if (
		await prisma.user.findFirst({
			where: { email: AUTHENTICATED_EMAIL },
		})
	) {
		console.log("Database already seeded. 🌱");
		return;
	}

	let email = AUTHENTICATED_EMAIL;
	let password = AUTHENTICATED_EMAIL_PASSWORD;

	if (!isValidEmail(email)) {
		throw Error("Invalid email");
	}

	let passwordErrors = validatePassword(password);

	if (passwordErrors.length > 0) {
		throw Error(
			"PASSWORD ERROR: " + passwordErrors.map((err) => err.type).join(", "),
		);
	}

	// cleanup the existing database
	await prisma.user.delete({ where: { email } }).catch(() => void 0);
	await prisma.blogPost.deleteMany().catch(() => void 0);

	let hashedPassword = await bcrypt.hash(password, 10);
	let user = await prisma.user.create({
		data: {
			email,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
			profile: {
				create: {
					nameFirst: "Chance",
					nameLast: "Strickland",
					avatarUrl:
						"https://pbs.twimg.com/profile_images/1541089143706374144/uoW00Tgv_400x400.jpg",
				},
			},
		},
	});

	await prisma.blogPost.create({
		data: {
			title: "My first note",
			body: "Hello, world!",
			slug: slugify("My first note"),
			description: "A simple note",
			userId: user.id,
		},
	});

	console.log(`Database has been seeded. 🌱`);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
