import { defineStore } from "pinia";

export interface Address {
  id: string;
  name: string;
  street: string;
  house: string;
  apartment?: string;
  comment?: string;
}

export interface ProfileState {
  name: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
}

export const useProfileStore = defineStore("profile", {
  state: (): ProfileState => ({
    name: "",
    phone: "",
    avatar: undefined,
    addresses: [],
  }),

  getters: {
    hasAddresses: (state) => state.addresses.length > 0,
    getAddressById: (state) => (id: string) => {
      return state.addresses.find((a) => a.id === id);
    },
  },

  actions: {
    setProfile(name: string, phone: string, avatar?: string) {
      this.name = name;
      this.phone = phone;
      if (avatar) {
        this.avatar = avatar;
      }
    },

    addAddress(address: Omit<Address, "id">) {
      const id = `address-${Date.now()}-${Math.random()}`;
      this.addresses.push({
        ...address,
        id,
      });
    },

    updateAddress(addressId: string, address: Partial<Omit<Address, "id">>) {
      const index = this.addresses.findIndex((a) => a.id === addressId);
      if (index !== -1) {
        this.addresses[index] = {
          ...this.addresses[index],
          ...address,
        };
      }
    },

    removeAddress(addressId: string) {
      const index = this.addresses.findIndex((a) => a.id === addressId);
      if (index !== -1) {
        this.addresses.splice(index, 1);
      }
    },

    clearProfile() {
      this.name = "";
      this.phone = "";
      this.avatar = undefined;
      this.addresses = [];
    },
  },
});

