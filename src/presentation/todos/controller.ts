import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDTO } from "../../domain/dtos";
import { UpdateTodoDTO } from "../../domain/dtos/todos/update-todo.dto";

export class TodosController {
    constructor(){}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos)
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'});
        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        todo 
        ? res.json(todo)
        : res.status(404).json({error: `TODO with id ${id} not found`})
    }

    public postTodo = async (req: Request, res: Response) => {
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);

        if( error ) return res.status(400).json({error});

        const todo = await prisma.todo.create({
            data: createTodoDTO!
        });

        res.json(todo);
    }

    public putTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [ error, updateTodoDTO ] = UpdateTodoDTO.create({...req.body, id})
        if( error ) return res.status(400).json({error});

        const existTodo = await prisma.todo.findFirst({
            where: {
                id
            }
        })

        if( !existTodo ) return res.status(404).json({error: `TODO with id ${id} not found`})   
        const todo = await prisma.todo.update({
            where: {
                id: id
            },
            data: updateTodoDTO!.values
        });

        res.json( updateTodoDTO ); 
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'});
        
        const existTodo = await prisma.todo.findFirst({
            where: {
                id
            }
        })
        if( !existTodo ) return res.status(404).json({error: `TODO with id ${id} not found`})

        const todo = await prisma.todo.delete({
            where: {
                id: id
            }
        });
        res.json(todo);   
    }
}