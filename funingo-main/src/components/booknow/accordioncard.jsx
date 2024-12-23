import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CardEditForm from './cardEditForm';
import { useSelector } from 'react-redux';
import { flag_prices } from '../../constants';

const AccordionList = ({
  persons,
  setPersons,
  packagesData,
  setTotalPrice,
  freebiesOption,
  setPremium100Live,
  setPremium50Live
}) => {
  const packageMap = useSelector(store => store.userSlice.packageMap);
  const [expanded, setExpanded] = useState(null);
  const [editedPersonId, setEditedPersonId] = useState(null);

  const handleEdit = id => {
    setEditedPersonId(id);
  };

  const handleEditCancel = () => {
    setEditedPersonId(null);
  };

  const handleSave = editedDetails => {
    let totalPrice = 0;
    const updatedPersons = persons.map(person => {
      if (person.id !== editedDetails.id) {
        totalPrice += parseInt(obj?.price);
        return person;
      }
      let obj = editedDetails;

      const pID = obj?.package;
      const pkgObj = packageMap?.[pID];
      obj = {
        ...obj,
        price:
          (pkgObj?.price ?? 0) +
          (obj.extra_red * flag_prices.red_flag_price +
            obj.extra_yellow * flag_prices.yellow_flag_price +
            obj.extra_green * flag_prices.green_flag_price +
            obj.golden_flag * flag_prices.golden_flag_price)
      };
      totalPrice += parseInt(obj?.price);
      
      return obj;
    });

    totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
    console.log("persons from accordian",persons);
    setPersons([...updatedPersons]);
    setEditedPersonId(null);
  };

  const handlePackageName = id => {
    const pkgObj = packageMap?.[id];
    return pkgObj?.package_name;
  };

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const removeItemHandler = id => {
    setPersons(
      persons.filter(item => {
        if (item.id === id) {
          if (item.selectedPremium?.premium_type === '50%') {
            setPremium50Live(curr => [...curr, item.selectedPremium]);
          } else if (item.selectedPremium?.premium_type === '100%') {
            setPremium100Live(curr => [...curr, item.selectedPremium]);
          }
        }
        return item.id !== id;
      })
    );
  };

  return (
    <Grid width={'100%'} display={'flex'} flexDirection={'column'} gap='15px'>
      {persons.map((person, index) => (
        <Grid
          key={person.id}
          sx={{
            background: 'white',
            borderRadius: '5px'
          }}
        >
          <Grid>
            {editedPersonId === person.id ? (
              <Grid p='15px'>
                <CardEditForm
                  initialValues={person}
                  packagesData={packagesData}
                  onSubmit={handleSave}
                  freebiesOption={freebiesOption}
                  handleEditCancel={handleEditCancel}
                  selectedPremium={person.selectedPremium}
                />
              </Grid>
            ) : (
              <Grid
                width={'100%'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                p='5px 15px '
                sx={{
                  height: '45px',
                  cursor: 'pointer',
                  position: 'relative',

                  '&:hover': {
                    '& .action-btns': {
                      display: 'flex'
                    }
                  }
                }}
              >
                <Typography>{`${person.name} (${person.age}y)`}</Typography>

                <Grid
                  sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <Grid className='action-btns' sx={{ display: 'none' }}>
                    {/* <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleEdit(person.id);
                      }}
                    >
                      <EditIcon color='black' />
                    </IconButton> */}
                    {/* <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        removeItemHandler(person.id);
                      }}
                    >
                      <CloseIcon color='black' />
                    </IconButton> */}
                  </Grid>

                  {person.selectedPremium?.premium_type === '50%' ? (
                    <Grid
                      sx={{
                        display: 'flex',
                        gap: '5px'
                      }}
                    >
                      <Typography
                        sx={{
                          textDecoration: 'line-through'
                        }}
                      >
                        Rs.{person?.price}
                      </Typography>
                      <Typography>
                        Rs.&nbsp;{Math.floor(person?.price / 2)}
                      </Typography>
                    </Grid>
                  ) : (
                    <Typography>Rs.{person?.price}</Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default AccordionList;
