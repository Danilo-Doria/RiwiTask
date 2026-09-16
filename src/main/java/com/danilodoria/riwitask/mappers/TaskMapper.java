package com.danilodoria.riwitask.mappers;

import com.danilodoria.riwitask.dto.request.TaskRequestDTO;
import com.danilodoria.riwitask.dto.response.TaskResponseDTO;
import com.danilodoria.riwitask.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")// "spring" permite inyectarlo con @Autowired en tus servicios
public interface TaskMapper {
    // De Entidad a Response DTO (Salida)
    TaskResponseDTO toResponseDTO(Task task);

    // De Request DTO a Entidad (Entrada)
    @Mapping(target = "id", ignore = true)  // El ID se genera en la base de datos
    @Mapping(target = "createdAt", ignore = true)
    /*
     * MapStruct, toma el valor que viene en clientId (source) y asígnalo dentro de la
     * propiedad id del objeto client (target)
     */
    @Mapping(target = "client.id", source = "clientId")
    Task toEntity(TaskRequestDTO requestDTO);
}
