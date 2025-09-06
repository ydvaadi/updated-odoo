"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    await prisma.refreshToken.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.task.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    const hashedPassword = await argon2_1.default.hash('password123');
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                passwordHash: hashedPassword,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                passwordHash: hashedPassword,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Mike Johnson',
                email: 'mike@example.com',
                passwordHash: hashedPassword,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                passwordHash: hashedPassword,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Alex Brown',
                email: 'alex@example.com',
                passwordHash: hashedPassword,
            },
        }),
    ]);
    console.log('✅ Created demo users');
    const projects = await Promise.all([
        prisma.project.create({
            data: {
                name: 'E-commerce Platform',
                description: 'Building a modern e-commerce platform with React and Node.js',
                createdBy: users[0].id,
            },
        }),
        prisma.project.create({
            data: {
                name: 'Mobile App Development',
                description: 'iOS and Android app for task management',
                createdBy: users[1].id,
            },
        }),
        prisma.project.create({
            data: {
                name: 'Data Analytics Dashboard',
                description: 'Real-time analytics dashboard for business intelligence',
                createdBy: users[2].id,
            },
        }),
    ]);
    console.log('✅ Created demo projects');
    const memberships = await Promise.all([
        prisma.membership.create({
            data: {
                userId: users[0].id,
                projectId: projects[0].id,
                role: client_1.Role.ADMIN,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[1].id,
                projectId: projects[0].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[2].id,
                projectId: projects[0].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[3].id,
                projectId: projects[0].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[1].id,
                projectId: projects[1].id,
                role: client_1.Role.ADMIN,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[0].id,
                projectId: projects[1].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[4].id,
                projectId: projects[1].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[2].id,
                projectId: projects[2].id,
                role: client_1.Role.ADMIN,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[3].id,
                projectId: projects[2].id,
                role: client_1.Role.MEMBER,
            },
        }),
        prisma.membership.create({
            data: {
                userId: users[4].id,
                projectId: projects[2].id,
                role: client_1.Role.MEMBER,
            },
        }),
    ]);
    console.log('✅ Created project memberships');
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Design user authentication system',
                description: 'Implement JWT-based authentication with refresh tokens',
                status: client_1.TaskStatus.DONE,
                priority: client_1.Priority.HIGH,
                projectId: projects[0].id,
                assigneeId: users[0].id,
                dueDate: new Date('2024-01-15'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Create product catalog API',
                description: 'RESTful API for managing products with CRUD operations',
                status: client_1.TaskStatus.IN_PROGRESS,
                priority: client_1.Priority.HIGH,
                projectId: projects[0].id,
                assigneeId: users[1].id,
                dueDate: new Date('2024-02-01'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Implement shopping cart functionality',
                description: 'Add to cart, remove from cart, and update quantities',
                status: client_1.TaskStatus.TODO,
                priority: client_1.Priority.MEDIUM,
                projectId: projects[0].id,
                assigneeId: users[2].id,
                dueDate: new Date('2024-02-15'),
            },
        }),
        prisma.task.create({
            data: 'Setup payment integration',
            description: 'Integrate Stripe for payment processing',
            status: client_1.TaskStatus.TODO,
            priority: client_1.Priority.URGENT,
            projectId: projects[0].id,
            assigneeId: users[3].id,
            dueDate: new Date('2024-01-30'),
        }),
        prisma.task.create({
            data: {
                title: 'Design app wireframes',
                description: 'Create low-fidelity wireframes for all screens',
                status: client_1.TaskStatus.DONE,
                priority: client_1.Priority.MEDIUM,
                projectId: projects[1].id,
                assigneeId: users[1].id,
                dueDate: new Date('2024-01-10'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Setup React Native project',
                description: 'Initialize React Native project with TypeScript',
                status: client_1.TaskStatus.IN_PROGRESS,
                priority: client_1.Priority.HIGH,
                projectId: projects[1].id,
                assigneeId: users[0].id,
                dueDate: new Date('2024-01-25'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Implement user onboarding flow',
                description: 'Create welcome screens and tutorial for new users',
                status: client_1.TaskStatus.TODO,
                priority: client_1.Priority.MEDIUM,
                projectId: projects[1].id,
                assigneeId: users[4].id,
                dueDate: new Date('2024-02-10'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Setup data pipeline',
                description: 'Configure ETL pipeline for data processing',
                status: client_1.TaskStatus.IN_PROGRESS,
                priority: client_1.Priority.HIGH,
                projectId: projects[2].id,
                assigneeId: users[2].id,
                dueDate: new Date('2024-02-05'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Create dashboard components',
                description: 'Build reusable chart and visualization components',
                status: client_1.TaskStatus.TODO,
                priority: client_1.Priority.MEDIUM,
                projectId: projects[2].id,
                assigneeId: users[3].id,
                dueDate: new Date('2024-02-20'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Implement real-time updates',
                description: 'Setup WebSocket connections for live data updates',
                status: client_1.TaskStatus.TODO,
                priority: client_1.Priority.LOW,
                projectId: projects[2].id,
                assigneeId: users[4].id,
                dueDate: new Date('2024-03-01'),
            },
        }),
    ]);
    console.log('✅ Created demo tasks');
    const messages = await Promise.all([
        prisma.message.create({
            data: {
                content: 'Welcome to the E-commerce Platform project! Let\'s build something amazing together.',
                projectId: projects[0].id,
                authorId: users[0].id,
            },
        }),
        prisma.message.create({
            data: {
                content: 'I\'ve completed the authentication system. Ready for review!',
                projectId: projects[0].id,
                authorId: users[0].id,
            },
        }),
        prisma.message.create({
            data: {
                content: 'Great work! I\'ll start working on the product catalog API next.',
                projectId: projects[0].id,
                authorId: users[1].id,
            },
        }),
        prisma.message.create({
            data: {
                content: 'The mobile app wireframes look fantastic! Ready to start development.',
                projectId: projects[1].id,
                authorId: users[1].id,
            },
        }),
        prisma.message.create({
            data: {
                content: 'I\'ve set up the React Native project structure. Should be ready for the team soon.',
                projectId: projects[1].id,
                authorId: users[0].id,
            },
        }),
        prisma.message.create({
            data: {
                content: 'Data pipeline is coming along well. We should have initial data flowing by next week.',
                projectId: projects[2].id,
                authorId: users[2].id,
            },
        }),
    ]);
    console.log('✅ Created demo messages');
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                type: client_1.NotificationType.TASK_ASSIGNED,
                message: 'You have been assigned a new task: "Create product catalog API"',
                userId: users[1].id,
                projectId: projects[0].id,
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                type: client_1.NotificationType.TASK_COMPLETED,
                message: 'Task "Design user authentication system" has been completed',
                userId: users[0].id,
                projectId: projects[0].id,
                isRead: true,
            },
        }),
        prisma.notification.create({
            data: {
                type: client_1.NotificationType.MESSAGE_POSTED,
                message: 'New message in project: "Great work! I\'ll start working on the product catalog API next."',
                userId: users[2].id,
                projectId: projects[0].id,
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                type: client_1.NotificationType.PROJECT_INVITED,
                message: 'You have been invited to join the project "Mobile App Development"',
                userId: users[0].id,
                projectId: projects[1].id,
                isRead: true,
            },
        }),
        prisma.notification.create({
            data: {
                type: client_1.NotificationType.TASK_OVERDUE,
                message: 'Task "Setup payment integration" is overdue',
                userId: users[3].id,
                projectId: projects[0].id,
                isRead: false,
            },
        }),
    ]);
    console.log('✅ Created demo notifications');
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${users.length} users created`);
    console.log(`- ${projects.length} projects created`);
    console.log(`- ${memberships.length} memberships created`);
    console.log(`- ${tasks.length} tasks created`);
    console.log(`- ${messages.length} messages created`);
    console.log(`- ${notifications.length} notifications created`);
    console.log('\n🔑 Demo credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('Email: alex@example.com | Password: password123');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map