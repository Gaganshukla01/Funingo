import { createSlice } from '@reduxjs/toolkit';
import { getAllImages, getPhoneNumbers } from '../../../actions/admin';

const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    phone_numbers: [],
    images: {
      banner: [],
      sportEvent: [],
      weddingEvent: [],
      corporateEvent: []
    },
    isPremiumSubscriptionModalOpen: false,
    isAuthModalOpen: false
  },
  reducers: {
    updatePhoneNumbers: (state, action) => {
      state.phone_numbers = action.payload;
    },
    openPremiumSubscriptionModal: state => {
      state.isPremiumSubscriptionModalOpen = true;
    },
    closePremiumSubscriptionModal: state => {
      state.isPremiumSubscriptionModalOpen = false;
    },
    openAuthModal: state => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: state => {
      state.isAuthModalOpen = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPhoneNumbers.fulfilled, (state, action) => {
        state.phone_numbers = action.payload?.phone_numbers;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.images = {
          banner: [],
          sportEvent: [],
          weddingEvent: [],
          corporateEvent: []
        };
        action.payload?.images?.forEach(image => {
          if (image.image_type === 'banner') {
            state.images.banner.push(image);
          } else if (image.image_type === 'sport_event') {
            state.images.sportEvent.push(image);
          } else if (image.image_type === 'wedding_event') {
            state.images.weddingEvent.push(image);
          } else if (image.image_type === 'corporate_event') {
            state.images.corporateEvent.push(image);
          }
        });
      });
  }
});

export const {
  openPremiumSubscriptionModal,
  closePremiumSubscriptionModal,
  updatePhoneNumbers,
  openAuthModal,
  closeAuthModal
} = appSlice.actions;
export default appSlice.reducer;
