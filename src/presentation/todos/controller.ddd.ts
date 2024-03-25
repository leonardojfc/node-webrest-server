import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDTO } from "../../domain/dtos";
import { UpdateTodoDTO } from "../../domain/dtos/todos/update-todo.dto";
import { TodoRepository } from "../../domain";

export class TodosController {
    constructor(
        private readonly todoRepository: TodoRepository
    ){}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        res.json(todos);
    };

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        try {
            const todo = await this.todoRepository.findById(id);
            res.json(todo);
        } catch (error) {
            res.status(400).json({error})
        } 
    };

    public postTodo = async (req: Request, res: Response) => {
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);

        if( error ) return res.status(400).json({error});

        const todo = await this.todoRepository.create(createTodoDTO!);
        console.log(todo);
        res.json(todo);
    };

    public putTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [ error, updateTodoDTO ] = UpdateTodoDTO.create({...req.body, id})
        if( error ) return res.status(400).json({error});

        const updatedTodo = await this.todoRepository.updateById( updateTodoDTO! );

        res.json( updatedTodo ); 
    };

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'});
        
        const deletedTodo = await this.todoRepository.deleteById(id);
        
        res.json(deletedTodo);   
    };
}