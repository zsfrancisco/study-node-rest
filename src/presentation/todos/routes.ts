import {Router} from "express";
import {TodosController} from "./controller";
import {TodoRepositoryImpl} from "../../infrastructure/repository/todo.repository.impl";
import {TodoDatasourceImpl} from "../../infrastructure/datasource/todo.datasource.impl";

export class TodosRoutes {
    static get routes(): Router {
        const router = Router();
        const dataSource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(dataSource);
        const todoController = new TodosController(todoRepository);
        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodo);
        router.delete('/:id', todoController.deleteTodo);
        return router;
    }
}