import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, MapPin, PencilLine, Plus, Save, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../components/SEO.jsx";
import Button from "../components/Button.jsx";
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  updateProfile,
} from "../redux/slices/authSlice.js";

const createBlankAddress = (user) => ({
  fullName: user?.name || "",
  phone: user?.phone || "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
});

const addressToForm = (address) => ({
  fullName: address?.fullName || "",
  phone: address?.phone || "",
  addressLine1: address?.addressLine1 || "",
  addressLine2: address?.addressLine2 || "",
  city: address?.city || "",
  state: address?.state || "",
  pincode: address?.pincode || "",
  country: address?.country || "India",
  isDefault: Boolean(address?.isDefault),
});

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState(createBlankAddress(null));
  const [editingAddressId, setEditingAddressId] = useState("");

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    if (!editingAddressId) {
      setAddressForm(createBlankAddress(user));
    }
  }, [user, editingAddressId]);

  const sortedAddresses = useMemo(() => {
    const addresses = Array.isArray(user?.addresses) ? [...user.addresses] : [];
    return addresses.sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileForm));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...addressForm,
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      addressLine1: addressForm.addressLine1.trim(),
      addressLine2: addressForm.addressLine2.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      country: addressForm.country.trim() || "India",
    };

    const action = editingAddressId
      ? updateAddress({ addressId: editingAddressId, addressData: payload })
      : addAddress(payload);

    const result = await dispatch(action);
    if (action.fulfilled.match(result)) {
      toast.success(editingAddressId ? "Address updated" : "Address added");
      setEditingAddressId("");
      setAddressForm(createBlankAddress(user));
    } else {
      toast.error(result.payload || "Unable to save address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm(addressToForm(address));
  };

  const handleCancelEdit = () => {
    setEditingAddressId("");
    setAddressForm(createBlankAddress(user));
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Delete this saved address?")) return;
    const result = await dispatch(deleteAddress(addressId));
    if (deleteAddress.fulfilled.match(result)) {
      toast.success("Address deleted");
      if (editingAddressId === addressId) {
        handleCancelEdit();
      }
    } else {
      toast.error(result.payload || "Unable to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    const result = await dispatch(setDefaultAddress(addressId));
    if (setDefaultAddress.fulfilled.match(result)) {
      toast.success("Default address updated");
    } else {
      toast.error(result.payload || "Unable to update default address");
    }
  };

  return (
    <>
      <SEO title="My Profile - Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">My Profile</h1>

          <div className="grid gap-6">
            <div className="glass-card p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-400 text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-slate-900 font-semibold text-lg truncate">
                  {user?.name || "Your account"}
                </h2>
                <p className="text-slate-600 text-sm truncate">{user?.email}</p>
                <span
                  className={`badge mt-1.5 ${
                    user?.role === "admin"
                      ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {user?.role || "user"}
                </span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-primary-400" />
                <h3 className="text-slate-900 font-semibold">Personal Information</h3>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input-field"
                    placeholder="Enter name..."
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email..."
                    className="input-field"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={profileForm.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setProfileForm((prev) => ({ ...prev, phone: value }));
                    }}
                    placeholder="9876543210"
                  />
                </div>
                <Button type="submit" className="text-white" loading={loading}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </form>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <h3 className="text-slate-900 font-semibold">
                    {editingAddressId ? "Edit Address" : "Add Address"}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm mb-5">
                  Save delivery addresses here so checkout can reuse them.
                </p>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        className="input-field"
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Phone *</label>
                      <input
                        className="input-field"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))
                        }
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Address Line 1 *</label>
                    <input
                      className="input-field"
                      value={addressForm.addressLine1}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, addressLine1: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Address Line 2</label>
                    <input
                      className="input-field"
                      value={addressForm.addressLine2}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, addressLine2: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <input
                        className="input-field"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">State *</label>
                      <input
                        className="input-field"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, state: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Pincode *</label>
                      <input
                        className="input-field"
                        value={addressForm.pincode}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, "") }))
                        }
                        maxLength={6}
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Country</label>
                    <input
                      className="input-field"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, country: e.target.value }))
                      }
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                    />
                    Make this my default address
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="text-white flex-1" loading={loading}>
                      {editingAddressId ? (
                        <>
                          <Save className="w-4 h-4" />
                          Update Address
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Address
                        </>
                      )}
                    </Button>
                    {editingAddressId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-secondary justify-center flex-1 py-3 text-black/60 hover:text-black"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-400" />
                    <h3 className="text-slate-900 font-semibold">Saved Addresses</h3>
                  </div>
                  <span className="badge bg-slate-100 text-slate-600 border-slate-200">
                    {sortedAddresses.length}
                  </span>
                </div>

                {sortedAddresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
                    <p className="text-slate-700 font-medium">No saved addresses yet</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Add your first delivery address to make checkout faster.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedAddresses.map((address) => (
                      <div
                        key={address._id}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-900">{address.fullName}</p>
                              {address.isDefault && (
                                <span className="badge bg-green-50 text-green-600 border-green-200">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-sm mt-1">{address.phone}</p>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                              {address.addressLine1}
                              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {address.country || "India"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleEditAddress(address)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <PencilLine className="w-4 h-4" />
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(address._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-primary-200 text-primary-600 hover:bg-primary-50"
                              disabled={loading}
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(address._id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
