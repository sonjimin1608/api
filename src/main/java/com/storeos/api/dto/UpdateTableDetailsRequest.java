package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTableDetailsRequest{
    private Integer tableNumber;
    private Integer coordX;
    private Integer coordY;
    private Integer width;
    private Integer height;
    private Integer people;
}
