import { pool } from "../../config/database";
import { UpdatePositionDTO, UserPosition } from "./position.types";

export const getUserPositionService = async (
  userId: string,
): Promise<UserPosition | null> => {
  const result = await pool.query(
    `
    SELECT
      up.id,
      up.user_id,
      ST_Y(up.position::geometry) AS latitude,
      ST_X(up.position::geometry) AS longitude,
      json_build_object('id', u.id, 'userName', u.user_name, 'email', u.email) AS user,
      up.updated_at
    FROM public.user_positions up
    JOIN public.users u ON up.user_id = u.id
    WHERE up.user_id = $1
    `,
    [userId],
  );

  return result.rows[0] || null;
};

export const getPositionsService = async (): Promise<UserPosition[]> => {
  const result = await pool.query(`
    SELECT
      up.id,
      up.user_id,
      ST_Y(up.position::geometry) AS latitude,
      ST_X(up.position::geometry) AS longitude,
      json_build_object('id', u.id, 'userName', u.user_name, 'email', u.email) AS user,
      up.updated_at
    FROM public.user_positions up
    JOIN public.users u ON up.user_id = u.id
    ORDER BY up.updated_at DESC
  `);

  return result.rows;
};

export const createPositionService = async (
  userId: string,
  dto: UpdatePositionDTO,
): Promise<UserPosition> => {
  const result = await pool.query(
    `
    INSERT INTO public.user_positions (user_id, position)
    VALUES ($1, ST_MakePoint($2, $3)::geography)
    ON CONFLICT (user_id) DO UPDATE SET 
      position = ST_MakePoint($2, $3)::geography,
      updated_at = now()
    RETURNING
      id,
      user_id,
      ST_Y(position::geometry) AS latitude,
      ST_X(position::geometry) AS longitude,
      updated_at
    `,
    [userId, dto.longitude, dto.latitude],
  );

  const row = result.rows[0];

  const userResult = await pool.query(
    `SELECT user_name, email FROM public.users WHERE id = $1`,
    [userId],
  );
  const user = userResult.rows[0];

  return {
    ...row,
    user: { userName: user?.user_name || 'Usuario', email: user?.email || '' },
  };
};

export const updatePositionService = async (
  userId: string,
  dto: UpdatePositionDTO,
): Promise<UserPosition> => {
  // Simplificamos usando la función que ya maneja el conflicto
  return createPositionService(userId, dto);
};

export const deletePositionService = async (userId: string): Promise<void> => {
  await pool.query(`DELETE FROM public.user_positions WHERE user_id = $1`, [
    userId,
  ]);
};
