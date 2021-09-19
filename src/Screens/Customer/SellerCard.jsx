import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {
    Button
} from "@chakra-ui/react";

export default function SellerCard({ image, seller_name, med_name, seller_add, seller_phone, distance, med_price, seller, viewSeller, noItems, setTotalCost }) {

    useEffect(()=>{
        let val1=parseInt(noItems);
        let val2=parseInt(med_price.price);
        setTotalCost(val1 * val2);
        console.log('------------>', val1 * val2);
    }, [noItems])
    return (
        <Card style={{
            // width: '350px'
        }}>
            <CardActionArea>
                <CardMedia
                style={{
                    height: '140px'
                }}
                image={image}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h5">
                        {seller_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <div>
                            <p>Paracetamol</p>
                            <p>Rs. {med_price?.price} per unit</p>
                            <p>
                                Address: {seller_add}
                            </p>
                            <p>{distance} kms aways</p>
                        </div>
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button colorScheme='teal' variant='solid' style={{
                    width: '100%'
                }} onClick={()=>viewSeller(seller)}>
                    Buy
                </Button>
            </CardActions>
        </Card>
    );
}
