import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl";

export class TodoRoutes {
    static get routes(): Router{

        const router = Router();
        const todoDatasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(todoDatasource);
        const todosController = new TodosController(todoRepository);
        router.get('/', todosController.getTodos)
        router.get('/:id', todosController.getTodoById)
        router.post('/', todosController.postTodo)
        router.put('/:id', todosController.putTodo)
        router.delete('/:id', todosController.deleteTodo)
        return router;
    }
}