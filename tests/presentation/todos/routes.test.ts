import request from "supertest";
import {testServer} from "../../test-server";
import {prisma} from "../../../src/data/postgres";

describe('todos routes', () => {
    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    const todo1 = {text: 'hello world 1'};
    const todo2 = {text: 'hello world 2'};

    test('should return todos api/todos', async () => {
        await prisma.todo.createMany({data: [todo1, todo2]});
        const {body} = await request(testServer.app)
            .get('/api/todos')
            .expect(200)
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();
        expect(body[1].completedAt).toBeNull();
    });

    test('should return a todo api/todos/:id', async () => {
        const todoCreated = await prisma.todo.create({data: todo1});
        const {body} = await request(testServer.app)
            .get(`/api/todos/${todoCreated.id}`)
            .expect(200);

        expect(body).toEqual({
            id: todoCreated.id,
            text: todoCreated.text,
            completedAt: todoCreated.completedAt
        });
    });

    test('should return a 404 NotFound todo api/todos/:id', async () => {
        const todoId = 999;

        const {body} = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(404);
        expect(body).toEqual({error: `Todo with id ${todoId} not found`});
    });

    test('should create a todo api/todos', async () => {
        const {body} = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });
    });

    test('should return an error when text is empty while creating a todo api/todos', async () => {
        const {body} = await request(testServer.app)
            .post('/api/todos')
            .send({text: ''})
            .expect(400);

        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('should return an error when text is not present while creating a todo api/todos', async () => {
        const {body} = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('should return an updated todo api/todos/:id', async () => {
        const todoToUpdate = await prisma.todo.create({data: todo1});
        const {body} = await request(testServer.app)
            .put(`/api/todos/${todoToUpdate.id}`)
            .send({text: 'new text', completedAt: '2024-02-19'})
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'new text',
            completedAt: '2024-02-19T00:00:00.000Z'
        });
    });

    test('should return 404 if todo not found api/todos/:id', async () => {
        const todoId = 999;
        const {body} = await request(testServer.app)
            .put(`/api/todos/${todoId}`)
            .send({text: 'new text', completedAt: '2024-02-19'})
            .expect(404);

        expect(body).toEqual({error: `Todo with id ${todoId} not found`});
    });

    test('should return an updated todo only the date api/todos/:id', async () => {
        const todoToUpdate = await prisma.todo.create({data: todo1});
        const {body} = await request(testServer.app)
            .put(`/api/todos/${todoToUpdate.id}`)
            .send({completedAt: '2024-02-19'})
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: '2024-02-19T00:00:00.000Z'
        });
    });

    test('should return a deleted todo api/todos/:id', async () => {
        const todoToDelete = await prisma.todo.create({data: todo1});
        const {body} = await request(testServer.app)
            .delete(`/api/todos/${todoToDelete.id}`)
            .expect(200);

        expect(body).toEqual({
            id: todoToDelete.id,
            text: todoToDelete.text,
            completedAt: null
        });
    });

    test('should return 404 if todo not found api/todos/:id', async () => {
        const todoId = 999;
        const {body} = await request(testServer.app)
            .delete(`/api/todos/${todoId}`)
            .expect(404);

        expect(body).toEqual({error: `Todo with id ${todoId} not found`});
    });
});