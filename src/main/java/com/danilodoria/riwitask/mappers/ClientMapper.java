package com.danilodoria.riwitask.mappers;

import com.danilodoria.riwitask.dto.request.ClientRequestDTO;
import com.danilodoria.riwitask.dto.response.ClientResponseDTO;
import com.danilodoria.riwitask.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring") // "spring" permite inyectarlo con @Autowired en tus servicios
public interface ClientMapper {
    // De Entidad a Response DTO (Salida)
    ClientResponseDTO toResponseDTO(Client client);

    // De Request DTO a Entidad (Entrada)
    @Mapping(target = "id", ignore = true)  // El ID se genera en la base de datos
    @Mapping(target = "active", ignore = true)
    Client toEntity(ClientRequestDTO requestDTO);
}
