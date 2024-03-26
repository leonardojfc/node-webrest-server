import { Request, Response } from "express"
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";

export class TodosController {
    constructor(
        private readonly todoRepository: TodoRepository
    ){}

    private handleError = (res: Response, error: unknown) => {
        if( error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
            return;
        }

        res.status(500).json({error: 'Internal Server Error - Check logs'});
    }

    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => this.handleError(res, error));
    };

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetTodo(this.todoRepository)
            .execute( id )
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error));
    };

    public postTodo = (req: Request, res: Response) => {
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);

        if( error ) return res.status(400).json({error});

        new CreateTodo(this.todoRepository)
            .execute(createTodoDTO!)
            .then(todo => res.status(201).json(todo))
            .catch(error => this.handleError(res, error));
    };

    public putTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [ error, updateTodoDTO ] = UpdateTodoDTO.create({...req.body, id})
        if( error ) return res.status(400).json({error});

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDTO!)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error));
    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'});
        
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error));  
    };
}