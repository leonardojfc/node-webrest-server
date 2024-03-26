import { prisma } from "../../data/postgres";
import { CreateTodoDTO, CustomError, TodoDatasource, TodoEntity, UpdateTodoDTO } from "../../domain";

export class TodoDatasourceImpl implements TodoDatasource{

    async create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDTO
        });

        return TodoEntity.fromObject(todo);
    }
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();

        return todos.map(TodoEntity.fromObject);
    }
    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({
            where: {id}
        });

        if( !todo ) throw new CustomError(`Todo with id ${id} not found`, 404);
        return TodoEntity.fromObject(todo);
    }
    async updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity> {
        await this.findById( updateTodoDTO.id );
        const updatedTodo = await prisma.todo.update({
            where: { id: updateTodoDTO.id},
            data: updateTodoDTO.values
        });

        return TodoEntity.fromObject(updatedTodo);
    }
    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById( id );
        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        return TodoEntity.fromObject(deletedTodo);
    }

}