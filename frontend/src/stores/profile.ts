import { defineStore } from "pinia";

export interface Address {
  id?: number;
  name: string;
  street: string;
  building: string;
  flat?: string;
  comment?: string;
  userId?: string;
}

export interface ProfileState {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
}

export const useProfileStore = defineStore("profile", {
  state: (): ProfileState => ({
    id: undefined,
    name: "",
    email: "",
    phone: "",
    avatar: undefined,
    addresses: [],
  }),

  getters: {
    hasAddresses: (state) => state.addresses.length > 0,
    getAddressById: (state) => (id: number) => {
      return state.addresses.find((a) => a.id === id);
    },
  },

  actions: {
    setProfile(id: string, name: string, email: string, phone: string, avatar?: string) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
      if (avatar) {
        this.avatar = avatar;
      }
    },

    addAddress(address: Omit<Address, "id">) {
      this.addresses.push({
        ...address,
      });
    },

    updateAddress(addressId: number, address: Partial<Omit<Address, "id">>) {
      const index = this.addresses.findIndex((a) => a.id === addressId);
      if (index !== -1) {
        this.addresses[index] = {
          ...this.addresses[index],
          ...address,
        };
      }
    },

    removeAddress(addressId: number) {
      const index = this.addresses.findIndex((a) => a.id === addressId);
      if (index !== -1) {
        this.addresses.splice(index, 1);
      }
    },

    clearProfile() {
      this.id = undefined;
      this.name = "";
      this.email = "";
      this.phone = "";
      this.avatar = undefined;
      this.addresses = [];
    },
  },
});

