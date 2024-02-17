import {Request, Response} from 'express';
import {
    CreateTodo,
    CreateTodoDto,
    DeleteTodo,
    GetTodo,
    GetTodos,
    TodoRepository,
    UpdateTodo,
    UpdateTodoDto
} from "../../domain";

export class TodosController {
    //* DI
    constructor(
        private readonly todoRepository: TodoRepository
    ) {
    }

    public getTodos = (_: Request, res: Response) => {
        new GetTodos(this.todoRepository).execute()
            .then(todos => res.json(todos))
            .catch(error => res.status(400).json({error}));
    };

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetTodo(this.todoRepository).execute(id)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({error}));
    };

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({error});
        new CreateTodo(this.todoRepository).execute(createTodoDto!)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({error}));
    };

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(400).json({error});
        new UpdateTodo(this.todoRepository).execute(updateTodoDto!)
            .then(updatedTodo => res.json(updatedTodo))
            .catch(error => res.status(400).json({error}));
    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        new DeleteTodo(this.todoRepository).execute(id)
            .then(deletedTodo => res.json(deletedTodo))
            .catch(error => res.status(400).json({error}));
    };
}