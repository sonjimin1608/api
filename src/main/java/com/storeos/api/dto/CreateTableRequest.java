package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTableRequest {
    private Integer coordX;
    private Integer coordY;
    private Integer width;
    private Integer height;
}
