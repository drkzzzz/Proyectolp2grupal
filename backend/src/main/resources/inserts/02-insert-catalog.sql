-- path: backend/src/main/resources/inserts/02-insert-catalog.sql

INSERT INTO UnidadesMedida (nombre_unidad, abreviatura)
VALUES ('Unidad','UND'),('Docena','DOC'),('Caja','CJA'),('Metro','MTR');

INSERT INTO MaterialesProducto (nombre_material)
VALUES ('Algodón'),('Poliéster'),('Cuero'),('Denim'),('Spandex'),('Lana'),('Nylon');

INSERT INTO CategoriasProducto (nombre_categoria, descripcion)
VALUES ('Camisetas','Camisetas varias'),
       ('Pantalones','Pantalones varias'),
       ('Zapatos','Zapatos varias');

INSERT INTO MarcasProducto (id_empresa, nombre_marca)
VALUES ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),'Nike'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),'Adidas'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),'Puma'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Glamour Time'),'Tommy Hilfiger'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Glamour Time'),'Calvin Klein'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Performance Footwear'),'Converse'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Performance Footwear'),'Vans'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Street Vibe'),'Gucci'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Street Vibe'),'Chanel');

INSERT INTO Modelos (nombre_modelo, id_marca, imagen_principal)
VALUES ('Clásico', (SELECT TOP 1 id_marca FROM MarcasProducto WHERE nombre_marca='Nike' AND id_empresa=(SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance')), NULL),
       ('Deportivo', (SELECT TOP 1 id_marca FROM MarcasProducto WHERE nombre_marca='Nike' AND id_empresa=(SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance')), NULL),
       ('Casual', (SELECT TOP 1 id_marca FROM MarcasProducto WHERE nombre_marca='Adidas' AND id_empresa=(SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance')), NULL),
       ('Running Pro', (SELECT TOP 1 id_marca FROM MarcasProducto WHERE nombre_marca='Converse' AND id_empresa=(SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Performance Footwear')), NULL);