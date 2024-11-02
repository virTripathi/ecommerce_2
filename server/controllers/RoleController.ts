import { Request, Response } from 'express';
import { Role,UserRole,User } from '../database/Models';

class RoleController {
    async get(req: Request, res: Response) {
        try {
            const roles = await Role.findAll();
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({ message: 'Error fetching roles' });
        }
    }
    
    async assign(req: Request, res: Response) {
        const { id: role_id, user_id } = req.params;

        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const role = await Role.findByPk(role_id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            await UserRole.create({ user_id: parseInt(user_id), role_id: parseInt(role_id) });

            return res.status(200).json({ message: 'Role assigned successfully' });
        } catch (error) {
            console.error('Error assigning role:', error);
            return res.status(500).json({ message: 'Error assigning role' });
        }
    }
}

export default new RoleController();
